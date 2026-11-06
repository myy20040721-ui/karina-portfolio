// 点击后才创建游戏窗口，演示稿打开时不下载 Unity 构建。
const startButton = document.querySelector('#prototype-start');
const launch = document.querySelector('#prototype-launch');
const gameWindow = document.querySelector('#prototype-window');
const stopButton = document.querySelector('#prototype-stop');
const fullscreenButton = document.querySelector('#prototype-fullscreen');
// file 协议无法运行 WebAssembly 资源，给本地文件访问者一个明确的预览入口。
if (location.protocol === 'file:') {
  document.querySelector('#prototype-hint').hidden = false;
  startButton.textContent = '打开本地试玩 ↗';
}
startButton.addEventListener('click', () => {
  if (location.protocol === 'file:') {
    location.href = document.querySelector('#prototype-hint a').href;
    return;
  }
  const frame = document.createElement('iframe');
  frame.src = gameWindow.dataset.gameSrc;
  frame.title = gameWindow.dataset.gameTitle;
  // 原型只使用键鼠输入；明确禁止嵌入窗口访问设备相机和麦克风。
  frame.allow = "fullscreen; autoplay; camera 'none'; microphone 'none'";
  frame.allowFullscreen = true;
  launch.replaceWith(frame);
  fullscreenButton.hidden = false;
  stopButton.hidden = false;
  frame.addEventListener('load', () => frame.focus(), { once: true });
});
// 全屏只由点击触发，符合浏览器对全屏和鼠标锁定的手势要求。
fullscreenButton.addEventListener('click', () => gameWindow.requestFullscreen());

// 移除整个 iframe 会卸载游戏文档；保留原封面节点，方便再次点击开始。
stopButton.addEventListener('click', async () => {
  if (document.fullscreenElement === gameWindow) await document.exitFullscreen();
  gameWindow.querySelector('iframe').replaceWith(launch);
  stopButton.hidden = true;
  fullscreenButton.hidden = true;
  startButton.focus();
});
