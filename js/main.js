miro.onReady(() => {
    miro.initialize({
        extensionPoints: {
            getWidgetMenuItems: (widgets) => {
                return Promise.resolve({
                    tooltip: 'Load calculation',
                    svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12.611 13.663c.262-.187.559-.274.849-.274.616 0 1.21.392 1.405 1.044-.249-.191-.541-.285-.836-.285-.301 0-.603.097-.866.285-.522.374-.753 1.009-.551 1.611-.814-.581-.819-1.795-.001-2.381zm2.073 7.831c.651.218 2.665.772 4.999 2.506l4.317-3.088c-1.123-1.569-.816-2.669-1.932-4.229-.499-.695-.939-1.12-1.755-.977l-.234.043.394.548c.239.335-.267.683-.499.357l-.351-.49c-.124-.174-.34-.256-.548-.21l-.796.179.478.666c.24.336-.267.681-.499.356l-.412-.576c-.129-.18-.353-.26-.562-.208l-.809.203.504.705c.241.336-.267.682-.499.357l-1.658-2.334c-.269-.376-.793-.463-1.17-.194-.376.27-.464.793-.193 1.17l2.632 3.7c-.812-.299-2.059-.426-2.289.411-.139.501.262.898.882 1.105zm-.684-18.494h-11v5h11v-5zm-7 9h3v-2h-3v2zm-1-2h-3v2h3v-2zm0 3h-3v2h3v-2zm-3 5h3v-2h-3v2zm7-5h-3v2h3v-2zm2.306 6h-10.306v-17h13v9.75c1.487.733 2 2.546 2 2.546v-14.296h-17v21h11.821c-.128-.802.049-1.379.485-2zm-1.306-9v2h.507c.709-.486 1.569-.711 2.493-.568v-1.432h-3zm-1 6h-3v2h3v-2z"/></svg>',
                    onClick: async () => {
                        const isAuthorized = await miro.isAuthorized()

                        if (!isAuthorized) {
                            // Ask the user to authorize the app.
                            await miro.requestAuthorization()
                        }
                        // Get selected widgets
                        let selectedWidgets = await miro.board.selection.get()

                        var totalLoad = calculate(selectedWidgets)
                        miro.showNotification("TOTAL LOAD: " + totalLoad);

                        function calculate(widgets) {
                            return sumTagsValues(widgets, (a) => a.type)
                        }

                        function sumTagsValues(list, getType) {
                            var sum = 0
                            list.forEach((item) => {
                                var type = getType(item)
                                if (type == 'CARD' || type == 'STICKER') {
                                    var tags = item.tags;
                                    if (tags != undefined) {
                                        for (var i = 0; i < tags.length; i++) {
                                            let title = tags[i].title;
                                            //let color = tags[i].color;
                                            if (title.startsWith("E:") /*&& color == '#f24726'*/) {
                                                var tagValue = title.substr(2, title.length);
                                                if(isNumeric(tagValue)){
                                                    sum = sum + parseFloat(tagValue);
                                                }
                                                
                                            }
                                        }
                                    }
                                }
                            })

                            return sum;
                        }

                        function isNumeric(n) {
                            return !isNaN(parseFloat(n)) && isFinite(n);
                        }
                    },
                })
            }
        }
    })
})
