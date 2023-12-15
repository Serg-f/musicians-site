from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.views import LoginView, LogoutView
from django.shortcuts import render, redirect
from django.urls import reverse_lazy
from django.views.generic import ListView, DetailView, CreateView, FormView, UpdateView, DeleteView, RedirectView

from musicians.models import Musicians, Styles
from musicians.nav_menu import menu


class Home(RedirectView):
    url = reverse_lazy('articles_list', kwargs={'slug': 'all'})


class ArticlesList(ListView):
    model = Musicians
    template_name = 'musicians/articles.html'
    paginate_by = 3

    def get_queryset(self):
        if self.kwargs['slug'] == 'all':
            return Musicians.objects.filter(is_published=True)
        return Musicians.objects.filter(style__slug=self.kwargs['slug'], is_published=True)

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Famous musicians'
        context['styles'] = Styles.objects.all()
        context['style_selected'] = self.kwargs['slug']
        context['menu'] = menu
        context['menu'][0]['is_active'] = 'active'
        return context


class ArticleAdd(LoginRequiredMixin, CreateView):
    model = Musicians
    template_name = 'musicians/add_article.html'
    fields = ['title', 'content', 'photo', 'style', 'video']
    success_url = reverse_lazy('articles', kwargs={'slug': 'all'})

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Add article'
        context['menu'] = menu
        context['menu'][1]['is_active'] = 'active'
        return context

    def form_valid(self, form):
        form.instance.author = self.request.user
        return super().form_valid(form)


class ArticleEdit(LoginRequiredMixin, UpdateView):
    pass


class ArticleDelete(LoginRequiredMixin, DeleteView):
    pass


class ArticleDetail(DetailView):
    pass


class About(FormView):
    pass


class Contact(FormView):
    pass
