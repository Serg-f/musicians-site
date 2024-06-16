from django_filters import rest_framework as filters

from .models import Musician


class MusiciansFilter(filters.FilterSet):
    style = filters.BaseInFilter(field_name='style__id', lookup_expr='in')

    class Meta:
        model = Musician
        fields = ['style', 'author_id']


class AuthorMusiciansFilter(MusiciansFilter):
    class Meta(MusiciansFilter.Meta):
        fields = MusiciansFilter.Meta.fields + ['is_published']
