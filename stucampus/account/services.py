#coding=utf-8
from datetime import datetime

from django.db import models
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User

from stucampus.account.models import Student


def account_signup(request, cleaned_data):
    email = cleaned_data['email']
    password = cleaned_data['password']
    new_user = User.objects.create_user(email, email, password)
    screen_name, email_domain = email.rsplit('@', 1)
    college_dict = {u'师范学院':'SF',u'文学院':'WX',u'外国语学院':'WGY',u'传播学院':'CB',u'经济学院':'JJ',u'管理学院':'GL',u'法学院':'FX',u'艺术设计学院':'YS',u'社会科学学院':'SK',u'数学与计算科学学院':'SX',u'物理科学与技术学院':'WL',u'化学与化工学院':'HG',u'材料学院':'CL',u'信息工程学院':'XX',u'计算机与软件学院':'JR',u'建筑与城市规划学院':'JG',u'土木工程学院':'TM',u'电子科学与技术学院':'DZ',u'机电与控制工程学院':'JD',u'生命科学学院':'SM',u'光电工程学院':'GD',u'高尔夫学院':'GEF',u'医学院':'YXY',u'国际交流学院':'GJ',u'继续教育学院':'JX'}
    szu_no = request.session['szu_no']
    szu_ic = request.session['szu_ic']
    szu_name = request.session['szu_name']
    szu_sex = request.session['szu_sex']
    szu_college = college_dict[request.session['szu_org_name'].split('/')[2]]
    student = Student.objects.create(user=new_user, screen_name=screen_name, true_name=szu_name, college=szu_college, gender=szu_sex, job_id=szu_no, card_id=szu_ic)
