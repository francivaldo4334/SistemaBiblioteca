from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User, Group


class PemissaoSomenteParaSuperUsuarios:
    def has_module_permission(self, request):
        return request.user.is_superuser

    def has_view_permission(self, request, obj=None):
        return request.user.is_superuser

    def has_add_permission(self, request):
        return request.user.is_superuser

    def has_change_permission(self, request, obj=None):
        return request.user.is_superuser

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser


class PermissaoParaTudo:
    def has_module_permission(self, request):
        return True

    def has_view_permission(self, request, obj=None):
        return True

    def has_add_permission(self, request):
        return True

    def has_change_permission(self, request, obj=None):
        return True

    def has_delete_permission(self, request, obj=None):
        return True


class PermissaoParaTudoMenosDeletar:
    def has_module_permission(self, request):
        return True

    def has_view_permission(self, request, obj=None):
        return True

    def has_add_permission(self, request):
        return True

    def has_change_permission(self, request, obj=None):
        return True

    def has_delete_permission(self, request, obj=None):
        return False or request.user.is_superuser


class PermissaoSomenteDeLeitura:
    def has_module_permission(self, request):
        return True

    def has_view_permission(self, request, obj=None):
        return True

    def has_add_permission(self, request):
        return False or request.user.is_superuser

    def has_change_permission(self, request, obj=None):
        return False or request.user.is_superuser

    def has_delete_permission(self, request, obj=None):
        return False or request.user.is_superuser


class MeuUserAdmin(
    PemissaoSomenteParaSuperUsuarios,
    UserAdmin,
):
    def save_model(self, request, obj, form, change):
        if not change:
            obj.is_staff = True
        super().save_model(request, obj, form, change)


class MeuGroupAdmin(
    PemissaoSomenteParaSuperUsuarios,
    admin.ModelAdmin,
):
    pass


admin.site.unregister(User)
admin.site.unregister(Group)
admin.site.register(User, MeuUserAdmin)
admin.site.register(Group, MeuGroupAdmin)
