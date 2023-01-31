import os
from setuptools import setup, find_packages


def read(fname):
    return open(os.path.join(os.path.dirname(__file__), fname)).read()


setup(
    name="backend-project",
    version="0.1.0",
    description="backend for the dummy project of the XAI-IML 2023 course.",
    long_description=read("../README.md"),
    classifiers=[
        "Programming Language :: Python :: 3.10",
        "Development Status :: 4 - Beta",
    ],
    keywords=[],
    url="",
    author="",
    author_email="",
    packages=find_packages(include=["src"]),
    package_dir={"src": "src"},
)
