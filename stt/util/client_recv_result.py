
import asyncio
import json

import keyboard
import websockets
import requests
import json
from config import ClientConfig as Config
from util.client_cosmic import Cosmic, console
from util.client_check_websocket import check_websocket
from util.client_hot_sub import hot_sub
from util.client_rename_audio import rename_audio
from util.client_strip_punc import strip_punc
from util.client_write_md import write_md
from util.client_type_result import type_result


async def recv_result():
    if not await check_websocket():
        return
    print('[connectionDone]\n')
    try:
        while True:
            # 接收消息
            message = await Cosmic.websocket.recv()
            message = json.loads(message)
            text = message['text']
            delay = message['time_complete'] - message['time_submit']

            # 如果非最终结果，继续等待
            if not message['is_final']:
                continue

            # 热词替换
            text = hot_sub(text)

            # 消除末尾标点
            text = strip_punc(text)

            # 打字
            await type_result(text)

            if Config.save_audio:
                # 重命名录音文件
                file_audio = rename_audio(message['task_id'], text, message['time_start'])

                write_md(text, message['time_start'], file_audio)
            unicode_text = text.encode('unicode-escape').decode()
            response = requests.post('http://127.0.0.1:6302/stt/?data=' + unicode_text, headers={'Content-Type': 'application/json'})
            # 控制台输出
            print(f'    转录时延：{delay:.2f}s')
            print(f'    识别结果：{text}')
            console.line()

    except websockets.ConnectionClosedError:
        print('[connectionError]\n')
    except websockets.ConnectionClosedOK:
        print('[connectionError]\n')
    except Exception as e:
        print(e)
    finally:
        return
