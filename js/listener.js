await fin.me.hide();

fin.me.getWebWindow().onblur = async () => {
  console.log("hiding");
  await fin.me.hide();
}

fin.InterApplicationBus.subscribe(
    { uuid: fin.me.identity.uuid },
    "show",
    async () => {
        console.log("Received message to show");
        await fin.me.show();
        await fin.me.focus();
        console.log("focused");
    }
);

fin.InterApplicationBus.subscribe(
    { uuid: fin.me.identity.uuid },
    "hide",
    async () => {
        console.log("Received message to hide");
        await fin.me.hide();
    }
);
