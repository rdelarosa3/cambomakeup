from flask import render_template, request, Blueprint, send_from_directory
from htmlmin.minify import html_minify
import os
#imports the models
# from blogsite.models import Post

main = Blueprint('main', __name__)


# APP INDEX/HOMEPAGE
@main.route("/")
#set multiple routes to same page
@main.route("/homepage")
def home():
	# return the template for route page
	rendered_html = render_template('home.html')
	return html_minify(rendered_html)


# APP ROBOTS.TXT
@main.route("/robots.txt")
def robots():
    return send_from_directory('static', 'robots.txt')

# APP SITEMAP.XML
@main.route("/sitemap.xml")
def sitemap():
    return send_from_directory('static', 'sitemap.xml')