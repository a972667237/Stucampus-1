from django.conf.urls import patterns, url

from stucampus.account.views import SignIn, SignOut, SignUp, Profile
from stucampus.account.views import ProfileEdit, Password, register_szu

urlpatterns = [
    url(r'^signup/?$', SignUp.as_view(), name='sign_up'),
    url(r'^signin/?$', SignIn.as_view(), name='sign_in'),
    url(r'^signout/?$', SignOut.as_view(), name='sign_out'),
    url(r'^profile/?$', Profile.as_view(), name='profile'),
    url(r'^profile/edit/?$', ProfileEdit.as_view(), name='profile_edit'),
    url(r'^profile/password/?$', Password.as_view(), name='profile_password'),
    url(r'^register_szu/?$', register_szu.as_view(), name='register_szu'),
]
