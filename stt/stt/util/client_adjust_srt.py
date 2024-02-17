import uuid
from pathlib import Path
from util import srt_from_txt
from util.client_cosmic import console, Cosmic


def adjust_srt(file: Path):

    # 生成任务 id
    task_id = str(uuid.uuid1())
    print(f'\n任务标识：{task_id}')
    print(f'    处理文件：{file}')

    # 调整 srt
    srt_from_txt.one_task(file)
    print(f'    调整完成')