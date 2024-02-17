'''
Author: 秋晚夕落 qwxl@zero-ai.online
Date: 2024-02-17 21:35:21
LastEditors: 秋晚夕落 qwxl@zero-ai.online
LastEditTime: 2024-02-18 00:14:47
FilePath: \cruise-client\stt\util\client_create_file.py
Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
'''
import wave 
import shutil 
from subprocess import Popen, PIPE, DEVNULL
from typing import Union, Tuple
from pathlib import Path
import time
from os import makedirs
from wave import Wave_write
import tempfile


def create_file(channels: int, time_start: float) -> Tuple[Path, Union[Popen, Wave_write]]:

    time_year = time.strftime('%Y', time.localtime(time_start))
    time_month = time.strftime('%m', time.localtime(time_start))
    time_ymdhms = time.strftime("%Y%m%d-%H%M%S", time.localtime(time_start))

    folder_path = Path() / time_year / time_month / 'assets'
    makedirs(folder_path, exist_ok=True)
    file_path = tempfile.mktemp(prefix=f'({time_ymdhms})', dir=folder_path)
    file_path = Path(file_path)
                     # 用户未安装 ffmpeg，则输出为 wav 格式
    file_path = file_path.with_suffix('.wav')
    file = wave.open(str(file_path), 'w')
    file.setnchannels(channels)
    file.setsampwidth(2)
    file.setframerate(48000)
    return file_path, file
