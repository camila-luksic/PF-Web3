

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accesos', '0001_initial'),
    ]

    def insertData(apps, schema_editor):
        Group = apps.get_model('auth', 'Group')


        administradorElecciones = Group(name="AdministradorElecciones")
        administradorElecciones.save()

        juradosElectorales = Group(name="JuradosElectorales")
        juradosElectorales.save()

        administradorPadronElectoral = Group(name="AdministradorPadronElectoral")
        administradorPadronElectoral.save()

        superAdministrador = Group(name="SuperAdministrador")
        superAdministrador.save()

        cliente = Group(name="Cliente")
        cliente.save()

    operations = [
        migrations.RunPython(insertData, atomic=True),
    ]