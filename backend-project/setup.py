import os
from setuptools import setup, find_packages


def read(fname):
    return open(os.path.join(os.path.dirname(__file__), fname)).read()


setup(
    name="dummy_server",
    version="0.0.1",
    description="Backend for the dummy project of the XAI-IML 2023 course.",
    long_description=read("README.md"),
    classifiers=[
        "Programming Languag'Development Status :: 2 - Pre-Alpha",
        "Intended Audience :: Developers",
        "Natural Language :: English",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.9",
        "Development Status :: 4 - Beta",
    ],
    keywords=[],
    url="",
    author="",
    author_email="",
    entry_point={
        "console_scripts": [
            "start-server = src.dummy_server.router.app:start_server",
        ]
    },
    install_requires=[
        "Flask",
        "flask-restful",
    ],
    packages=find_packages(where="src", include=["dummy_server*"]),
    package_dir={"": "src"},
)
