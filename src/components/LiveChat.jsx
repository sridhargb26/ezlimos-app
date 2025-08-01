import { useEffect } from 'react'

const LiveChat = () => {
  useEffect(() => {
    // Only initialize LiveChat in production
    const isProduction = window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1')
    
    if (!isProduction) {
      console.log('LiveChat disabled in development mode')
      return
    }

    // LiveChat integration
    window.__lc = window.__lc || {}
    window.__lc.license = 19052611
    window.__lc.integration_name = "manual_channels"
    window.__lc.product_name = "livechat"
    
    ;(function (n, t, c) {
      function i(n) {
        return e._h ? e._h.apply(null, n) : e._q.push(n)
      }
      var e = {
        _q: [],
        _h: null,
        _v: "2.0",
        on: function () {
          i(["on", c.call(arguments)])
        },
        once: function () {
          i(["once", c.call(arguments)])
        },
        off: function () {
          i(["off", c.call(arguments)])
        },
        get: function () {
          if (!e._h) throw new Error("[LiveChatWidget] You can't use getters before load.")
          return i(["get", c.call(arguments)])
        },
        call: function () {
          i(["call", c.call(arguments)])
        },
        init: function () {
          var n = t.createElement("script")
          n.async = !0
          n.type = "text/javascript"
          n.src = "https://cdn.livechatinc.com/tracking.js"
          t.head.appendChild(n)
        }
      }
      !n.__lc.asyncInit && e.init()
      n.LiveChatWidget = n.LiveChatWidget || e
    })(window, document, [].slice)

    // Cleanup function
    return () => {
      // Remove LiveChat script if needed
      const liveChatScript = document.querySelector('script[src="https://cdn.livechatinc.com/tracking.js"]')
      if (liveChatScript) {
        liveChatScript.remove()
      }
    }
  }, [])

  return (
    <noscript>
      <a href="https://www.livechat.com/chat-with/19052611/" rel="nofollow">
        Chat with us
      </a>
      , powered by{' '}
      <a href="https://www.livechat.com/?welcome" rel="noopener nofollow" target="_blank">
        LiveChat
      </a>
    </noscript>
  )
}

export default LiveChat 