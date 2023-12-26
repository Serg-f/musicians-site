from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from django.views.generic import CreateView

from musicians.views import MenuMixin
from users.forms import ContactForm


class ContactView(LoginRequiredMixin, MenuMixin, CreateView):
    form_class = ContactForm
    template_name = 'musicians/form.html'
    extra_context = {'title': 'Send us a message', 'menu_item_selected': 3}
    success_url = reverse_lazy('musicians:home')

    def form_valid(self, form):
        form.instance.user = self.request.user
        return super().form_valid(form)
