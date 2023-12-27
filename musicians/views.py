from pprint import pprint

from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.views import LoginView, LogoutView
from django.forms import modelformset_factory
from django.shortcuts import redirect
from django.urls import reverse_lazy
from django.views.generic import ListView, DetailView, CreateView, FormView, UpdateView, DeleteView, TemplateView

from musicians.models import Musician, Style
from musicians.nav_menu import menu
from users.models import Message


class MenuMixin:
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['styles'] = Style.objects.all()
        context['style_selected'] = self.kwargs.get('style_slug') or self.kwargs.get('slug', 'all')
        context['menu'] = menu
        return context


class ArticlesList(MenuMixin, ListView):
    model = Musician
    template_name = 'musicians/articles_list.html'
    paginate_by = 3
    extra_context = {'title': 'Famous musicians'}

    def get_queryset(self):
        if 'slug' not in self.kwargs or self.kwargs['slug'] == 'all':
            return Musician.objects.filter(is_published=True)
        return Musician.objects.filter(style__slug=self.kwargs['slug'], is_published=True)


class ArticleDetail(MenuMixin, DetailView):
    model = Musician
    template_name = 'musicians/article_detail.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = kwargs['object'].title
        return context


class ArticleCreate(LoginRequiredMixin, MenuMixin, CreateView):
    model = Musician
    template_name = 'musicians/form.html'
    fields = ['title', 'content', 'style', 'is_published', 'photo', 'video']
    success_url = reverse_lazy('musicians:home')
    extra_context = {'title': 'Create Article', 'menu_item_selected': 2}

    def form_valid(self, form):
        messages.success(self.request, "Your article has been created successfully!")
        form.instance.author = self.request.user
        return super().form_valid(form)


class ArticleEdit(LoginRequiredMixin, MenuMixin, UpdateView):
    model = Musician
    template_name = 'musicians/form.html'
    fields = ['content', 'style', 'is_published', 'photo', 'video']
    extra_context = {'title': 'Edit Article'}

    def get_success_url(self):
        return reverse_lazy('musicians:article_detail', args=[self.object.style.slug, self.object.slug])

    def form_valid(self, form):
        messages.success(self.request, "Your article has been updated successfully!")
        return super().form_valid(form)


class ArticleDelete(LoginRequiredMixin, MenuMixin, DeleteView):
    model = Musician
    template_name = 'musicians/article_confirm_delete.html'
    success_url = reverse_lazy('musicians:home')
    extra_context = {'title': 'Delete article'}

    def form_valid(self, form):
        messages.success(self.request, "Your article has been deleted successfully!")
        return super().form_valid(form)


class UserArticlesFormsetView(LoginRequiredMixin, MenuMixin, TemplateView):
    template_name = 'musicians/articles_user.html'
    extra_context = {'title': 'User articles'}
    formset_class = modelformset_factory(Musician, fields=('is_published',), extra=0)

    def get_queryset(self):
        return Musician.objects.filter(author=self.request.user)

    def get(self, request, *args, **kwargs):
        formset = self.formset_class(queryset=self.get_queryset())
        context = self.get_context_data(**kwargs, formset=formset)
        return self.render_to_response(context)

    def post(self, request, *args, **kwargs):
        formset = self.formset_class(request.POST, queryset=self.get_queryset())
        if formset.is_valid():
            formset.save()
            messages.success(request, "Your articles have been updated successfully!")
        return redirect('musicians:home')


class About(MenuMixin, TemplateView):
    template_name = 'musicians/about.html'
    extra_context = {'title': 'About us'}
