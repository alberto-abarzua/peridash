import argparse
import subprocess
import os
from pathlib import Path
import yaml
import shutil
from collections import defaultdict
import base64


class PrettyDumper(yaml.Dumper):
    def ignore_aliases(self, _):
        return True


class DeployTool:

    CURRENT_FILE_PATH = Path(__file__).parent.absolute()
    KUSTOMIZATION_DIR = CURRENT_FILE_PATH.parent / "kustomizations"
    ENVS_TEMP_DIR_NAME = "envs"
    SERVICE_ACCOUNT = "service-ci"

    def __init__(self) -> None:
        self.parser = self.create_arg_parser()

    def get_service_token(self, kustomizaton_dir: Path) -> str:
        kustomization_dict = self.read_kustomization_yaml(kustomizaton_dir)
        namespace = kustomization_dict["namespace"]
        secret_name = subprocess.run(
            ["kubectl", "get", "serviceaccount", "-n", namespace, self.SERVICE_ACCOUNT, "-o", "jsonpath='{.secrets[0].name}'"], capture_output=True, text=True)

        secret_name = secret_name.stdout
        secret_name = secret_name.strip("'")
        token = subprocess.run(
            ["kubectl", "get", "secret", secret_name, "-n", namespace, "-o", "jsonpath='{.data.token}'"], capture_output=True, text=True)
        error = token.stderr
        error = token.stderr
        token = token.stdout.strip("'")
        token = base64.b64decode(token).decode("utf-8")
        ca_cert = subprocess.run(
            ["kubectl", "get", "secret", secret_name, "-n", namespace, "-o", "jsonpath='{.data.ca\\.crt}'"], capture_output=True, text=True)
        error = ca_cert.stderr
        ca_cert = ca_cert.stdout.strip("'")

        cluster_name = subprocess.run(
            ["kubectl", "config", "view", "-o", "jsonpath='{.clusters[0].name}'"], capture_output=True, text=True)
        error = cluster_name.stderr
        cluster_name = cluster_name.stdout.strip("'")
        server = subprocess.run(
            ["kubectl", "config", "view", "-o", "jsonpath='{.clusters[0].cluster.server}'"], capture_output=True, text=True)
        error = server.stderr
        server = server.stdout.strip("'")

        kubeconfig = f"""
apiVersion: v1
clusters:
- name: {cluster_name}
  cluster:  
    certificate-authority-data: {ca_cert}
    server: {server}
contexts: 
- context:
    cluster: {cluster_name}
    user: {self.SERVICE_ACCOUNT}
  name: {self.SERVICE_ACCOUNT}-context
current-context: {self.SERVICE_ACCOUNT}-context
kind: Config
preferences: {""}
users:
- name: {self.SERVICE_ACCOUNT}
  user:
    token: {token}
"""
        return kubeconfig

    def create_arg_parser(self) -> argparse.ArgumentParser:
        parser = argparse.ArgumentParser()
        subparsers = parser.add_subparsers(dest='command')

        # Define subparsers for each command
        self.define_kustomize_parser(subparsers)
        self.define_rollout_parser(subparsers)
        self.define_token_parser(subparsers)

        return parser

    def define_kustomize_parser(self, subparsers):
        kustomize_parser = subparsers.add_parser('kustomize')
        kustomize_parser.add_argument('--dir', type=str, help='Directory name with kustomization.yaml', required=True)
        kustomize_parser.add_argument('--apply', action='store_true', help='Apply the kustomization')
        kustomize_parser.add_argument('--show', action='store_true', help='Show the kustomization')
        kustomize_parser.add_argument('--tag', type=str, help='Tag to apply to the image')
        kustomize_parser.add_argument('--dry-run', action='store_true', help='Dry run the kustomization')

    def define_rollout_parser(self, subparsers):
        rollout_parser = subparsers.add_parser('rollout')
        rollout_parser.add_argument('--dir', type=str, help='Directory name with kustomization.yaml', required=True)
        rollout_parser.add_argument('--deployments', type=str, nargs='+', help='Deployments to rollout', required=True)

    def define_token_parser(self, subparsers):
        token_parser = subparsers.add_parser('get-service-token')
        token_parser.add_argument('--dir', type=str, help='Directory name with kustomization.yaml', required=True)

    def run(self) -> None:
        args = self.parser.parse_args()
        self.gen_env_files(self.KUSTOMIZATION_DIR / args.dir)
        if args.command == 'kustomize':
            self.handle_kustomize(args)
        elif args.command == 'rollout':
            self.handle_rollout(args)
        elif args.command == 'get-service-token':
            self.handle_service_token(args)

    def handle_kustomize(self, args):
        kustomization_dir = self.KUSTOMIZATION_DIR / args.dir
        kustomization_str = self.generate_kustomization(kustomization_dir)
        show = args.show
        apply = args.apply
        dry_run = args.dry_run
        tag = args.tag

        if tag:
            kustomization_dict = self.read_kustomization_yaml(kustomization_dir)
            self.update_tag_on_kustomization_dict(
                kustomization_dict, tag)
            self.save_kustomization_yaml(
                kustomization_dir, kustomization_dict)

        if show:
            print(kustomization_str)

        if apply:
            if dry_run:
                print("Applying kustomization in dry run mode")
                subprocess.check_call(
                    ["kubectl", "apply", "-k", kustomization_dir, "--dry-run=client", "--validate=true"])
            else:
                print("Applying kustomization")
                subprocess.check_call(
                    ["kubectl", "apply", "-k", kustomization_dir])

    def handle_rollout(self, args):
        kustomization_dir = self.KUSTOMIZATION_DIR / args.dir
        kustomization_dict = self.read_kustomization_yaml(kustomization_dir)
        namespace = kustomization_dict["namespace"]

        for deployment in args.deployments:
            print(f"Rolling out {deployment}")
            subprocess.check_call(
                ["kubectl", "rollout", "restart", "deployment", deployment, "-n", namespace])

    def handle_service_token(self, args):
        kustomization_dir = self.KUSTOMIZATION_DIR / args.dir
        token = self.get_service_token(kustomization_dir)
        print('---')
        print(token)

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

        env_dir = kustomization_dir / self.ENVS_TEMP_DIR_NAME

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
                    if variable_name in [var[0] for var in vars_to_write[env_file_name]]:
                        vars_to_write[env_file_name] = [
                            var for var in vars_to_write[env_file_name] if var[0] != variable_name]
                    vars_to_write[env_file_name].append(
                        (variable_name, variable_value))

        for env_file_name, variables in vars_to_write.items():
            with open(env_dir / f"{env_file_name}.env", "w") as f:
                for variable in variables:
                    var_name, var_value = variable
                    f.write(f"{var_name}={var_value}\n")
                    print(
                        f"Writing {var_name} to {env_file_name}.env")

    def cleanup_temp_files(self, kustomization_dir: Path) -> None:
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


if __name__ == "__main__":
    cmd = DeployTool()
    cmd.run()
