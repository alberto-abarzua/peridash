import argparse
import subprocess
import os
from pathlib import Path
import yaml
import shutil
from collections import defaultdict


class PrettyDumper(yaml.Dumper):
    def ignore_aliases(self, data):
        return True


class DeployTool:
    CURRENT_FILE_PATH = Path(__file__).parent.absolute()
    KUSTOMIZATION_DIR = CURRENT_FILE_PATH.parent / "kustomizations"
    ENVS_TEMP_DIR = "envs"
    SERVICE_ACCOUNT = "service-ci"

    def __init__(self) -> None:

        self.parser = argparse.ArgumentParser()

        subparsers = self.parser.add_subparsers(dest='command')

        kustomize_parser = subparsers.add_parser('kustomize')
        kustomize_parser.add_argument(
            '--dir', type=str, help='Directory name with kustomization.yaml', required=True)
        kustomize_parser.add_argument(
            '--apply', action='store_true', help='Apply the kustomization')
        kustomize_parser.add_argument(
            '--show', action='store_true', help='Show the kustomization')
        kustomize_parser.add_argument(
            '--tag', type=str, help='Tag to apply to the image')
        kustomize_parser.add_argument(
            '--dry-run', action='store_true', help='Dry run the kustomization')

        rollout_parser = subparsers.add_parser('rollout')
        rollout_parser.add_argument(
            '--dir', type=str, help='Directory name with kustomization.yaml', required=True)

        # deployments list
        rollout_parser.add_argument(
            '--deployments', type=str, nargs='+', help='Deployments to rollout', required=True)

        token_parser = subparsers.add_parser('get-service-token')
        token_parser.add_argument(
            '--dir', type=str, help='Directory name with kustomization.yaml', required=True)

    def run(self) -> None:
        args = self.parser.parse_args()

        kustonmization_dir = self.KUSTOMIZATION_DIR / args.dir
        if args.command == 'kustomize':

            kustomization_str = self.generate_kustomization(kustonmization_dir)
            if args.tag:
                kustomization_dict = self.read_kustomization_yaml(
                    kustonmization_dir)
                self.update_tag_on_kustomization_dict(
                    kustomization_dict, args.tag)
                self.save_kustomization_yaml(
                    kustonmization_dir, kustomization_dict)
                kustomization_str = self.generate_kustomization(
                    kustonmization_dir)

            if args.show:
                print(kustomization_str)

            if args.apply:
                proc = subprocess.run(["kubectl", "apply", "-f", "-"],
                                      input=kustomization_str, text=True, capture_output=True)
                print(proc.stdout)
                print(proc.stderr)
            if args.dry_run:
                proc = subprocess.run(["kubectl", "apply", "--dry-run=client", "-f", "-"],
                                      input=kustomization_str, text=True, capture_output=True)
                print(proc.stdout)
                print(proc.stderr)

        elif args.command == 'rollout':
            kustomization_dict = self.read_kustomization_yaml(
                self.KUSTOMIZATION_DIR / args.dir)

            namespace = kustomization_dict["namespace"]
            print(f"Rolling out {args.deployments} in namespace {namespace}")
            for deployment in args.deployments:
                proc = subprocess.run(["kubectl", "rollout", "restart", "deployment", "-n", namespace, deployment],
                                      text=True, capture_output=True)
                print(proc.stdout)
                print(proc.stderr)

        elif args.command == 'get-service-token':
            self.get_service_token()

        self.cleanup_temp_files(kustonmization_dir)

    def generate_kustomization(self, kustomization_dir: Path) -> str:
        self.gen_env_files(kustomization_dir)
        kustomization = subprocess.run(
            ["kubectl", "kustomize", kustomization_dir], capture_output=True)

        error = kustomization.stderr.decode("utf-8")
        if error:
            print(error)
            return ""
        return kustomization.stdout.decode("utf-8")

    def update_tag_on_kustomization_dict(self, kustomization_dict: dict, tag: str) -> None:
        images = kustomization_dict["images"]
        for image in images:
            image["newTag"] = tag

    def gen_env_files(self, kustomization_dir: Path) -> None:
        env_dir = kustomization_dir / self.ENVS_TEMP_DIR
        kustomization_dict = self.read_kustomization_yaml(kustomization_dir)
        config_map_generator = kustomization_dict["configMapGenerator"]
        expected_env_files = []
        for config_map in config_map_generator:
            for env_file_path in config_map["envs"]:
                path = Path(env_file_path)
                path_name_no_extension = path.stem
                expected_env_files.append(path_name_no_extension)

        if os.path.exists(env_dir):
            shutil.rmtree(env_dir)
        os.mkdir(env_dir)

        current_env_vars = os.environ
        vars_to_write = defaultdict(list)

        for variable_name, variable_value in current_env_vars.items():
            for env_file_name in expected_env_files:
                if variable_name.startswith(env_file_name):
                    # check if first tuple element is in the list
                    if variable_name in [var[0] for var in vars_to_write[env_file_name]]:
                        vars_to_write[env_file_name] = [
                            var for var in vars_to_write[env_file_name] if var[0] != variable_name]
                    vars_to_write[env_file_name].append(
                        (variable_name, variable_value))
        # write to files
        for env_file_name, variables in vars_to_write.items():
            with open(env_dir / f"{env_file_name}.env", "w") as f:
                for variable in variables:
                    var_name, var_value = variable
                    f.write(f"{var_name}={var_value}\n")
                    print(
                        f"Writing {var_name} to {env_file_name}.env")

    def cleanup_temp_files(self, kustomization_dir: Path) -> None:
        # delete temp envs dir
        print("Cleaning up")
        file_to_delete = kustomization_dir / self.ENVS_TEMP_DIR
        if os.path.exists(file_to_delete):
            shutil.rmtree(file_to_delete)
       

    def read_kustomization_yaml(self, kustomization_dir: Path) -> dict:
        with open(kustomization_dir / "kustomization.yaml", "r") as f:
            kustomization = yaml.safe_load(f)
        return kustomization

    def save_kustomization_yaml(self, kustomization_dir: Path, kustomization: dict) -> None:
        with open(kustomization_dir / "kustomization.yaml", "w") as f:
            yaml.dump(kustomization, f, Dumper=PrettyDumper,
                      default_flow_style=False, allow_unicode=True, sort_keys=False)

    def rollout_deployments(self) -> None:
        pass

    def get_rollout_service_token(self) -> str:
        pass

    def get_service_token(self) -> str:
        secret_name = subprocess.run(
            ["kubectl", "get", "serviceaccount", self.SERVICE_ACCOUNT, "-o", "jsonpath='{.secrets[0].name}'"], capture_output=True, text=True)
        
        output = secret_name.stdout
        error = secret_name.stderr
        if error:
            print(error)
            return ""
        print (output)
        secret_name = secret_name.stdout
        


if __name__ == "__main__":
    cmd = DeployTool()
    cmd.run()
