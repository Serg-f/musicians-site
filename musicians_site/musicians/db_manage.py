from musicians.models import Styles
Styles.objects.create(name='Рок')
print(Styles.objects.all())