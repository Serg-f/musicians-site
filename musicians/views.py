from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.views import LoginView, LogoutView
from django.shortcuts import render, redirect
from django.urls import reverse_lazy
from django.views.generic import ListView, DetailView, CreateView, FormView

from .forms import *
from .utils import *


def show_admin(request):
    return redirect('admin/musicians/musicians/')


class ShowIndex(MixinData, ListView):
    model = Musicians
    template_name = 'musicians/index.html'
    context_object_name = 'posts'

    def get_queryset(self):
        return Musicians.objects.filter(is_published=True).select_related('style')

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data()
        user_dict = self.get_user_context(title='Main page')
        context.update(user_dict)
        return context


class ShowStyles(MixinData, ListView):
    model = Musicians
    template_name = 'musicians/index.html'
    context_object_name = 'posts'
    allow_empty = False

    def get_queryset(self):
        return Musicians.objects.filter(style__slug=self.kwargs['style_slug'], is_published=True).select_related(
            'style')

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data()
        s = Styles.objects.get(slug=self.kwargs['style_slug'])
        title = 'Стиль - ' + s.name.lower()
        style_selected = s.pk
        user_dict = self.get_user_context(title=title, style_selected=style_selected)
        context.update(user_dict)
        return context


class ShowPost(MixinData, DetailView):
    model = Musicians
    template_name = 'musicians/post.html'
    context_object_name = 'post'
    slug_url_kwarg = 'post_slug'

    def get_context_data(self, **kwargs):
        context = super().get_context_data()
        title = context['post'].title
        style_selected = context['post'].style_id
        user_dict = self.get_user_context(title=title, style_selected=style_selected)
        context.update(user_dict)
        return context


class AddArticle(LoginRequiredMixin, MixinData, CreateView):
    form_class = AddArticleForm
    template_name = 'musicians/add_article.html'
    success_url = reverse_lazy('home')
    login_url = reverse_lazy('login_add_art')

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data()
        user_dict = self.get_user_context(title='Add article')
        context.update(user_dict)
        return context


class Contact(MixinData, FormView):
    form_class = ContactForm
    template_name = 'musicians/contact.html'
    success_url = reverse_lazy('home')

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data()
        user_dict = self.get_user_context(title='Contact us')
        context.update(user_dict)
        return context

    def form_valid(self, form):
        print(form.cleaned_data)
        return redirect('home')


def about(request):
    params = {
        'title': 'About',
        'menu': menu,
        'styles': Styles.objects.filter(musicians__is_published=True).distinct()
    }
    return render(request, 'musicians/about.html', params)




class RegisterUser(MixinData, CreateView):
    form_class = RegisterUserForm
    template_name = 'musicians/register.html'
    success_url = reverse_lazy('login')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        user_di = self.get_user_context(title='Register')
        context.update(user_di)
        return context


class LoginUser(MixinData, LoginView):
    form_class = LoginUserForm
    template_name = 'musicians/login.html'
    next_page = reverse_lazy('home')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        user_di = self.get_user_context(title='Log In')
        context.update(user_di)
        return context


class LoginUserAddArt(LoginUser):
    template_name = 'musicians/login_add_art.html'


class LogoutUser(LogoutView):
    next_page = reverse_lazy('login')
