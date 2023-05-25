# peridash
---
## Getting started

1. Clonar la repo

2. Copiar y cambiar el nombre de `.env.template` a `.env`
    Para poder usar todos los features se debe tener una api key de openai.

3. Correr `docker compose build --no-cache`

4. Correr `docker compose up` para iniciar el proyecto

## Comandos utiles

```python
docker compose run web pdm run python manage.py --help # esto para correr cosas de django
docker compose run web pdm lint # para correr flake8 y lintear
docker compose run web pdm format # para formatiar el codigo que se puede auto formatear
docker compose run web pdm test # para  correr los tests
```

## Como hacer cambios

1. No se puede pushear directo a `main`, siempre se debe crear una rama nueva y hacer merge al final

2. Para hacer merge:
    - `git rebase main` en la rama que uno quiera mergear para resolver conflictos antes del merge
    - Correr los comandos `lint`, `format` y `test` de arriba. Notar que `format` no arregla todos los errores, entonces hay que revisar el output de `lint` para asegurarse de que todo esta bien
    - Hacer el merge request y asignar algun reviewer. Para poder completar el merge, el pipeline debe ser exitoso (build, lint, test)