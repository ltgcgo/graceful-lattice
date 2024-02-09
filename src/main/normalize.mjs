"use strict";

let normalize = function (path) {
	path = decodeURI(path);
	let pathArr = path.split("/");
	let ptr = 0;
	while (ptr < pathArr.length) {
		let dotCount = 0;
		for (let i0 = 0; i0 < pathArr[ptr].length; i0 ++) {
			if (pathArr[ptr][i0] == ".") {
				dotCount ++;
			};
		};
		if (pathArr[ptr].length > 0 && dotCount == pathArr[ptr].length) {
			pathArr[ptr] = "..";
		};
		let e = pathArr[ptr];
		if (e == ".." && ptr > 1 && pathArr[ptr - 1] != "..") {
			pathArr.splice(ptr - 1, 2);
		} else {
			ptr ++;
		};
	};
	let newPath = pathArr.join("/");
	return newPath;
};

export default normalize;
