from asyncio import Queue, AbstractEventLoop
import websockets
import sounddevice as sd
import sys
from pathlib import Path



class Cosmic:
    """
    用一个 class 存储需要跨模块访问的变量值，命名为 Cosmic
    """
    on = False
    queue_in: Queue
    queue_out: Queue
    loop: Union[None, AbstractEventLoop] = None
    websocket: websockets.WebSocketClientProtocol = None
    audio_files = {}
    stream: Union[None, sd.InputStream] = None
    kwd_list: List[str] = []