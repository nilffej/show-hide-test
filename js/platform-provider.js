fin.Platform.init();

export const win1 = await fin.Window.create({
  name: "emitting_window",
  uuid: "showing_wiemitting_windowndow",
  url: "http://localhost:5555/emitter.html",
  defaultWidth: 400,
  defaultHeight: 400,
  defaultLeft: 0,
  defaultTop: 0,
});


export const win2 = await fin.Window.create({
    name: "showing_window",
    uuid: "showing_window",
    url: "http://localhost:5555/listener.html",
    defaultWidth: 400,
    defaultHeight: 400,
    defaultLeft: 0,
    defaultTop: 0,
});
