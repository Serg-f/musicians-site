from .models import *

menu = [
    {'title': 'Добавить статью', 'url_name': 'add_article'},
    {'title': 'Об этом сайте', 'url_name': 'about'},
    {'title': 'Написать нам', 'url_name': 'contact'},
    # {'title': 'Админка', 'url_name': 'admin'},
]


class MixinData:
    paginate_by = 3

    def get_user_context(self, **kwargs):
        user_dict = kwargs
        styles = Styles.objects.filter(musicians__is_published=True).distinct()
        # styles = Styles.objects.all()
        user_dict['menu'] = menu
        user_dict['styles'] = styles
        if 'style_selected' not in user_dict:
            user_dict['style_selected'] = 0
        return user_dict
