/**
 * @file A simple window manager written in JavaScript.
 * @version 0.1 build 1001
 * @copyright Mike Liu 2021-2022
 */

var currentElement = {};

var mouseBaseX = 0;
var mouseBaseY = 0;


/**
 * MenuItem
 */

class MenuItem {

}
/**
 * Config 对象，用于创建 Window 类
 * 
 * @author Mike Liu
 * @param {Window} config.father 初始化的窗口的父窗口
 * @param {boolean} config.hasCloseButton 是否有关闭按钮
 * @param {boolean} config.hasMinimizeButton 是否有最小化按钮
 * @param {boolean} config.hasMaximizeButton 是否有最大化按钮
 * @param {number} config.relativeX 相对父组件的X位置
 * @param {number} config.relativeY 相对父组件的Y位置
 * @param {number} config.width 窗体的绝对水平长度
 * @param {number} config.height 窗体的绝对垂直长度
 * @param {MenuItem[]} config.menu 窗体菜单
 * @param {String} config.title 窗体标题
 * @param {String} config.icon 窗体图标字符串，窗体图标的URL或字体名
 * @param {String} config.id 窗口id，用于确定窗体内容的div
 * @param {boolean} config.resizable 是否可调整尺寸
 * 
 * 
 */
class Config {
	father=null;
	hasCloseButton = true;
	hasMinimizeButton = true;
	hasMaximizeButton = true;
	relativeX = 0;
	relativeY = 0;
	width = 0;
	height = 0;
	menu = [];
	title = null;
	icon = null;
	id = null;
	resizable = null;
}

/**
 * Window 类，用于创建窗体并指定位置
 * 
 * @author Mike Liu
 * @constructor
 * @author Mike Liu
 * @param {Config} config 配置文件
 * 
 */
class Window {
	element = {};
	isMinimized = false;
	isMaximized = false;
	relativeX = 0;
	relativeY = 0;
	width = 0;
	height = 0;
	top = 0;
	left = 0;
	hasFatherWindow = true;
	resizable = false;
	window = null;

	constructor(config) {

		this.relativeX = config.relativeX;
		this.relativeY = config.relativeY;
		this.width = config.width;
		this.height = config.height;
		this.top = config.top;
		this.left = config.left;
		this.element = document.createElement("div");
		this.element.id = config.id;
		this.element.className = "window";
		this.element.style.left = config.left + "px";
		this.element.style.top = config.top + "px";
		this.resizable = config.resizable ? config.resizable : false;


		if (!config.father) {
			this.hasFatherWindow = false;
			config.father = document.getElementById("container");
		}

		this.element.style.width = config.width + "px";
		this.element.style.height = config.height + "px";

		let titleBar = document.createElement("div");
		titleBar.className = "window-titleBar";
		titleBar.id = config.id + "_titleBar";

		titleBar.addEventListener("mousedown", (event) => {
			if (event.target == titleBar) {

				if (event.buttons === 1 && !this.isMaximized && !this.isMinimized) {

					currentElement = this.element;
					this.mouseBaseX = event.clientX - this.element.offsetLeft;
					this.mouseBaseY = event.clientY - this.element.offsetTop;
					let moveEvent = (ent) => {
						if (this.element.offsetTop < 25 && this.hasFatherWindow) {
							this.element.style.top = "25px";
						}
						this.element.style.top = ent.clientY - this.mouseBaseY + "px";
						this.element.style.left = ent.clientX - this.mouseBaseX + "px";
					}
					document.body.addEventListener("mousemove", moveEvent);
					console.log("added");
					let upEvent = () => {
						if (this.element.offsetTop > config.father.offsetHeight) {
							this.element.style.top = config.father.offsetHeight - 20 + "px";
						}
						if (this.element.offsetLeft > config.father.offsetWidth) {
							this.element.style.left = config.father.offsetWidth - 20 + "px";
						}
						if (this.element.offsetTop < 0 && !this.hasFatherWindow) {
							this.element.style.top = "1px";
						}
						if (this.element.offsetTop < 25 && this.hasFatherWindow) {
							this.element.style.top = "0px";
						}
						if (this.element.offsetLeft < -this.element.offsetWidth) {
							this.element.style.left = -this.element.offsetWidth + 80 + "px";
						}
						document.body.removeEventListener("mousemove", moveEvent, false);
						document.body.removeEventListener("mousemove", moveEvent, true);
						document.body.removeEventListener("mouseup", upEvent, false);
						document.body.removeEventListener("mouseup", upEvent, true);
						this.top = this.element.offsetTop;
						this.left = this.element.offsetLeft;
						this.width = this.element.offsetWidth;
						this.height = this.element.offsetHeight;

					}
					document.body.addEventListener("mouseup", upEvent);
				}
			}
		})
		let icon = document.createElement("img");
		icon.className = "window-icon";
		icon.src = (config.icon) ? config.icon : "";
		titleBar.appendChild(icon);

		let title = document.createElement("span");
		title.className = "window-title";
		title.id = config.id + "_title";
		title.innerHTML = config.title;
		titleBar.appendChild(title);



		if (config.hasCloseButton) {
			let closeButton = document.createElement("button")
			closeButton.id = config.id + "_close";
			closeButton.className = "window-close codicon codicon-chrome-close";
			closeButton.addEventListener("click", (function(elem) {
				return function() {
					elem.remove();
				}
			})(this.element))
			titleBar.appendChild(closeButton);
		}

		if (config.hasMaximizeButton) {
			let maximizeButton = document.createElement("button")
			maximizeButton.id = config.id + "_maximize";
			maximizeButton.className = "window-maximize codicon codicon-chrome-maximize";
			maximizeButton.addEventListener("click", () => {
				if (this.isMaximized) {
					this.element.style.top = this.top + "px";
					this.element.style.left = this.left + "px";
					this.element.style.width = this.width + "px";
					this.element.style.height = this.height + "px";
				} else {
					if (!this.hasFatherWindow) {
						this.element.style.top = "20px";
						this.element.style.left = "2px";
						this.element.style.width = "calc(100% - 4px)";
						this.element.style.height = "calc(100% - 40px)";
					} else {
						this.element.style.top = "0px";
						this.element.style.left = "0px";
						this.element.style.width = "100%";
						this.element.style.height = "calc(100% - 40px)";
					}
				}
				this.isMaximized = !this.isMaximized;
			});

			titleBar.appendChild(maximizeButton);
		}

		if (config.hasMinimizeButton) {
			let minimizeButton = document.createElement("button")
			minimizeButton.id = config.id + "_minimize";
			minimizeButton.className = "window-minimize codicon codicon-chrome-minimize";
			minimizeButton.addEventListener("click", (function(elem) {
				return function() {
					this.isMinimized = !this.isMinimized;
					elem.style.display = "none";
				}
			})(this.element))
			titleBar.appendChild(minimizeButton);
		}

		if (this.resizable) {
			let resize = (event) => {

				if (event.target === this.element || event.target === titleBar) {
					if (Math.abs(event.layerX) < 5 && Math.abs(event.layerY) < 5) {
						this.element.style.cursor = "nw-resize";

						let clickEvent = (event) => {
							this.mouseBaseX = event.clientX;
							this.mouseBaseY = event.clientY;
						}
						let moveEvent = (event) => {
							if (event.buttons === 1) {
								this.element.style.top = event.clientY + "px";
								this.element.style.left = event.clientX + "px";
								this.element.style.width += event.clientX - this.mouseBaseX + "px";
								this.element.style.height += event.clientY - this.mouseBaseY + "px";

							}
						}
						this.element.addEventListener("mousemove", moveEvent);
						let upEvent = (event) => {
							if (this.element.offsetTop > config.father.offsetHeight) {
								this.element.style.top = config.father.offsetHeight - 20 + "px";
							}
							if (this.element.offsetLeft > config.father.offsetWidth) {
								this.element.style.left = config.father.offsetWidth - 20 + "px";
							}
							if (this.element.offsetTop < 0 && !this.hasFatherWindow) {
								this.element.style.top = "1px";
							}
							if (this.element.offsetTop < 25 && this.hasFatherWindow) {
								this.element.style.top = "25px";
							}
							if (this.element.offsetLeft < -this.element.offsetWidth) {
								this.element.style.left = -this.element.offsetWidth + 80 + "px";
							}
							this.element.removeEventListener("mousemove", moveEvent);
							this.element.removeEventListener("mouseup", upEvent);
						}
						this.element.addEventListener("mouseup", upEvent);

						return;
					}
					if (Math.abs(this.element.offsetWidth - event.layerX) < 5 && Math.abs(event.layerY) < 5) {

						this.element.style.cursor = "ne-resize";
						return;
					}
					if (Math.abs(this.element.offsetWidth - event.layerX) < 5 && Math.abs(this.element.offsetHeight - event.layerY) < 5) {
						this.element.style.cursor = "se-resize";
						return;
					}
					if (Math.abs(event.layerX) < 5 && Math.abs(this.element.offsetHeight - event.layerY) < 5) {
						this.element.style.cursor = "sw-resize";
						return;
					}
					if (Math.abs(event.layerX) < 3) {
						this.element.style.cursor = "w-resize";
						return;
					}
					if (Math.abs(this.element.offsetWidth - event.layerX) < 3) {
						this.element.style.cursor = "e-resize";
						return;
					}
					if (Math.abs(event.layerY) < 3) {
						this.element.style.cursor = "n-resize";
						return;
					}
					if (Math.abs(this.element.offsetHeight - event.layerY) < 3) {
						this.element.style.cursor = "s-resize";

						return;
					}
					this.element.style.cursor = "auto";
				}

			}
			this.element.addEventListener("mousemove", resize);
		}

		this.element.appendChild(titleBar);
		this.window = document.createElement("div");
		this.window.className = "window-inner";
		this.window.id = config.id + "_inner";
		this.element.appendChild(this.window);
		config.father.appendChild(this.element);

	}

	getTaskElement() {

	}
}