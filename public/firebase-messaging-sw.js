self.addEventListener('push', function(event) {

    if (!event.data) return;

    let data = event.data.json();
    self.registration.showNotification(data.notification.title || 'No title', {
        body: data.notification.body || 'No body',
    });
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
});
