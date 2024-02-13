import os

from util.client_cosmic import console
from config import ClientConfig as Config


def show_mic_tips():
    console.rule('CapsWriter Offline Client')
    # print(f'\n项目地址：[cyan underline]https://github.com/HaujetZhao/CapsWriter-Offline', end='\n\n')
    markdown = (f'''

项目地址：https://github.com/HaujetZhao/CapsWriter-Offline

这是 CapsWriter-Offline，一个好用的离线语音输入工具。
'''
)
    print(markdown)
    console.rule()
    print(f'\n当前基文件夹：{os.getcwd()}')
    print(f'\n当前所用快捷键：{Config.shortcut}')

    console.line()


def show_file_tips():
    markdown = f'\n项目地址：https://github.com/HaujetZhao/CapsWriter-Offline'
    print(markdown)
    print(f'当前基文件夹：{os.getcwd()}')
