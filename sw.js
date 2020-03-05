importScripts("precache-manifest.bdea2641a005500c0d9212ba3cdfcc10.js");

/**
 * service worker 安装激活
 */
self.__precacheManifest = [].concat(self.__precacheManifest || [])

const dataCacheName = 'eTankData-v1'
const cacheName = 'eTank-pwa-app-1'
const filesToCache = [
  '/',
  '/index.html',
  '/js/app.js',
  '/js/chunk-vendors.js',
  '/js/about.js',
  '/img/logo.82b9c7a5.png'
]

self.addEventListener('install', function (e) {
  console.log('SW Install')
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log('SW precaching')
      return cache.addAll(self.__precacheManifest)
    })
  )
  self.skipWaiting()
})

self.addEventListener('activate', function (e) {
  console.log('SW Activate')
  e.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (key !== cacheName && key !== dataCacheName) {
          console.log('SW Removing old cache', key)
          return caches.delete(key)
        }
      }))
    })
  )
  return self.clients.claim()
})

self.addEventListener('fetch', function (e) {
  console.log('SW Fetch', e.request.url)
  // 如果数据相关的请求，需要请求更新缓存
  const dataUrl = '/mockData/'
  if (e.request.url.indexOf(dataUrl) > -1) {
    e.respondWith(
      caches.open(dataCacheName).then(function (cache) {
        return fetch(e.request).then(function (response) {
          cache.put(e.request.url, response.clone())
          return response
        }).catch(function () {
          return caches.match(e.request)
        })
      })
    )
  } else {
    e.respondWith(
      caches.match(e.request).then(function (response) {
        return response || fetch(e.request)
      })
    )
  }
})

