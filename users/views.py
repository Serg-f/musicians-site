from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from django.views.generic import CreateView, TemplateView

from musicians.models import Musician
from musicians.views import MenuMixin, LoginRequiredAddMessageMixin
from users.forms import ContactForm


class ContactView(LoginRequiredAddMessageMixin, MenuMixin, CreateView):
    form_class = ContactForm
    template_name = 'musicians/form.html'
    extra_context = {'title': 'Send us a message', 'menu_item_selected': 3}
    success_url = reverse_lazy('musicians:home')
    login_required_message = "You need to be logged in to send a message."

    def form_valid(self, form):
        messages.success(self.request, "Your message has been sent successfully!")
        form.instance.user = self.request.user
        return super().form_valid(form)


class UserProfileView(LoginRequiredAddMessageMixin, MenuMixin, TemplateView):
    template_name = 'users/profile.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        queryset = Musician.objects.filter(author=self.request.user)
        context['title'] = 'User Profile'
        context['articles_published_count'] = queryset.filter(is_published=True).count()
        context['articles_total_count'] = queryset.count()
        return context
