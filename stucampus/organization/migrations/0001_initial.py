# -*- coding: utf-8 -*-
# Generated by Django 1.9.3 on 2016-04-23 16:20
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('account', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Organization',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=20)),
                ('phone', models.CharField(max_length=11)),
                ('url', models.URLField()),
                ('logo', models.CharField(max_length=50)),
                ('is_banned', models.BooleanField(default=False)),
                ('ban_reason', models.CharField(blank=True, max_length=250, null=True)),
                ('is_deleted', models.BooleanField(default=False)),
                ('managers', models.ManyToManyField(related_name='orgs_as_manager', to='account.Student')),
                ('members', models.ManyToManyField(related_name='orgs_as_member', to='account.Student')),
            ],
            options={
                'permissions': (('organization_manager', '\u7ec4\u7ec7\u5e10\u53f7\u7ba1\u7406\u5458'),),
            },
        ),
    ]
