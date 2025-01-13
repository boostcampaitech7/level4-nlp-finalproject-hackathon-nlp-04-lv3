import os
import subprocess
import curses


def get_directory_size_in_bytes(path):
    """주어진 디렉토리나 파일의 크기를 바이트 단위로 반환"""
    try:
        if os.path.isdir(path):
            # 디렉토리인 경우 du -sb 사용
            result = subprocess.run(
                ["du", "-sb", path],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
            )
            if result.returncode != 0:
                return 0
            return int(result.stdout.split()[0])
        else:
            # 파일인 경우 os.stat 사용
            return os.path.getsize(path)
    except Exception:
        return 0


def convert_bytes_to_gb(size_in_bytes):
    """바이트 단위를 GB로 변환"""
    return size_in_bytes / (1024**3)


def get_items_with_size(parent_dir):
    """주어진 디렉토리의 하위 파일과 디렉토리들과 그 크기를 반환"""
    items = []
    try:
        with os.scandir(parent_dir) as entries:
            for entry in entries:
                if entry.is_symlink():
                    continue  # 심볼릭 링크는 무시
                item_type = "DIR" if entry.is_dir(follow_symlinks=False) else "FILE"
                dir_full_path = os.path.join(parent_dir, entry.name)
                size_in_bytes = get_directory_size_in_bytes(dir_full_path)
                items.append((entry.name, dir_full_path, size_in_bytes, item_type))
    except PermissionError:
        pass
    return items


def delete_item(path):
    """특정 파일이나 디렉토리를 삭제"""
    try:
        if os.path.isdir(path):
            subprocess.run(["rm", "-rf", path], check=True)
        else:
            os.remove(path)
        return True
    except subprocess.CalledProcessError:
        return False
    except Exception:
        return False


def safe_addstr(stdscr, y, x, string, attr=0):
    """문자열을 안전하게 추가하는 함수. 문자열이 화면을 넘지 않도록 잘라냄."""
    try:
        height, width = stdscr.getmaxyx()
        if y >= height or x >= width:
            return  # 화면을 벗어나면 무시
        stdscr.addstr(y, x, string[: width - x - 1], attr)
    except curses.error:
        pass  # 문자열이 너무 길어서 추가할 수 없을 때 무시


def run_menu(stdscr):
    # 색상 설정
    curses.start_color()
    curses.init_pair(1, curses.COLOR_BLACK, curses.COLOR_WHITE)  # 선택된 항목
    curses.init_pair(2, curses.COLOR_BLUE, curses.COLOR_BLACK)  # 디렉토리
    curses.init_pair(3, curses.COLOR_GREEN, curses.COLOR_BLACK)  # 파일

    current_path = "/data/ephemeral/home/"
    history = []
    selected = 0
    scroll = 0

    while True:
        stdscr.clear()
        height, width = stdscr.getmaxyx()

        # 헤더 표시
        header = f"현재 경로: {current_path} (Press 'q' to quit, 'd' to delete, 'Enter' to enter directory, 'b' to go back)"
        safe_addstr(stdscr, 0, 0, header[: width - 1], curses.A_BOLD)

        # 하위 항목 목록과 크기 가져오기
        items = get_items_with_size(current_path)
        items.sort(key=lambda x: x[2], reverse=True)  # 크기 순으로 정렬

        # 항목 표시 리스트 준비
        dir_color = curses.color_pair(2)
        file_color = curses.color_pair(3)
        dir_indicator = "/"

        dir_list = []
        for name, path, size, item_type in items:
            display_name = name + dir_indicator if item_type == "DIR" else name
            size_gb = convert_bytes_to_gb(size)
            line = f"{display_name} - {size_gb:.2f} GB"
            dir_list.append((line, item_type))

        # 스크롤 처리
        max_display = height - 2  # 헤더와 메시지 라인 제외
        if selected < scroll:
            scroll = selected
        elif selected >= scroll + max_display:
            scroll = selected - max_display + 1

        display_items = dir_list[scroll : scroll + max_display]
        for idx, (line, item_type) in enumerate(display_items):
            y = idx + 1
            if scroll + idx == selected:
                # 선택된 항목 하이라이트
                safe_addstr(
                    stdscr, y, 0, f"> {line}"[: width - 1], curses.color_pair(1)
                )
            else:
                # 디렉토리와 파일에 따라 색상 다르게 적용
                if item_type == "DIR":
                    color = dir_color
                else:
                    color = file_color
                safe_addstr(stdscr, y, 0, f"  {line}"[: width - 1], color)

        stdscr.refresh()

        key = stdscr.getch()

        if key == curses.KEY_UP:
            if selected > 0:
                selected -= 1
        elif key == curses.KEY_DOWN:
            if selected < len(dir_list) - 1:
                selected += 1
        elif key == ord("q"):
            break
        elif key == ord("d"):
            if 0 <= selected < len(items):
                selected_item = items[selected]
                selected_path = selected_item[1]
                selected_type = selected_item[3]
                # 사용자 확인
                confirm_msg = f"정말로 '{selected_item[0]}' ({selected_type})을 삭제하시겠습니까? (y/n): "
                safe_addstr(stdscr, height - 1, 0, confirm_msg[: width - 1])
                stdscr.refresh()
                confirm = stdscr.getch()
                if confirm in [ord("y"), ord("Y")]:
                    success = delete_item(selected_path)
                    if success:
                        message = f"삭제 완료: {selected_item[0]}"
                        safe_addstr(stdscr, height - 1, 0, message[: width - 1])
                        del items[selected]
                        del dir_list[selected]
                        if selected >= len(dir_list):
                            selected = len(dir_list) - 1
                        if selected < 0:
                            selected = 0
                    else:
                        message = f"삭제 실패: {selected_item[0]}"
                        safe_addstr(stdscr, height - 1, 0, message[: width - 1])
                else:
                    message = "삭제 취소."
                    safe_addstr(stdscr, height - 1, 0, message[: width - 1])
                stdscr.getch()
        elif key == ord("\n") or key == curses.KEY_ENTER:
            if 0 <= selected < len(items):
                selected_item = items[selected]
                selected_path = selected_item[1]
                selected_type = selected_item[3]
                if selected_type == "DIR":
                    history.append(current_path)
                    current_path = selected_path
                    selected = 0
                    scroll = 0
        elif key == ord("b"):
            if history:
                current_path = history.pop()
                selected = 0
                scroll = 0


if __name__ == "__main__":
    curses.wrapper(run_menu)
