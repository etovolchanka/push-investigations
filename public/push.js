class Push {
    constructor(firebase) {

        this.storageItemName = 'fcm_token';

        this.permissionGranted = false;

        firebase.initializeApp({
            messagingSenderId: '48253656107',
        });

        this.messaging = firebase.messaging();

        this.subButton = document.getElementById('sub');
        this.unsubButton = document.getElementById('unsub');
        this.pushButton = document.getElementById('push');
        this.errorContainer = document.getElementById('error');
        this.successContainer = document.getElementById('succ');

        this.subButton.addEventListener('click', this.subscribe.bind(this));
        this.unsubButton.addEventListener('click', this.unsubscribe.bind(this));
        this.pushButton.addEventListener('click', this.sendTestPush.bind(this));

    }

    async init() {
        await this.initWorker();
        if (this.checkSubscription()) {
            this.setSubscribedButtonsState();
        } else {
            this.setNotSubscribedButtonsState();
        }
    }

    setSubscribedButtonsState() {
        this.subButton.setAttribute('disabled', 'true');
        this.unsubButton.removeAttribute('disabled');
        this.pushButton.removeAttribute('disabled');
    }

    setNotSubscribedButtonsState() {
        this.unsubButton.setAttribute('disabled', 'true');
        this.pushButton.setAttribute('disabled', 'true');
        this.subButton.removeAttribute('disabled');
    }

    checkSubscription() {
        return (!!this.getClientToken() && this.permissionGranted);
    }

    getClientToken() {
        return localStorage.getItem(this.storageItemName);
    }

    setClientToken(token) {
        localStorage.setItem(this.storageItemName, token);
    }

    async removeClientToken() {
        localStorage.removeItem(this.storageItemName);
    }

    showError(error) {
        this.errorContainer.innerText = JSON.stringify(error, null, 4);
    }

    showSuccess(result) {
        this.successContainer.innerText = JSON.stringify(result, null, 4);
    }

    async initWorker() {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        this.messaging.useServiceWorker(registration);
        this.permissionGranted = !!await registration.pushManager.getSubscription();
    }

    async subscribe() {
        await this.messaging.requestPermission();
        this.setClientToken(await this.messaging.getToken());
        this.setSubscribedButtonsState();
        alert('You have subscribed! Now try to send push notification!');
    }

    async unsubscribe() {
        const token = this.getClientToken();
        try {
            await this.messaging.deleteToken(token);
            this.removeClientToken();
            this.setNotSubscribedButtonsState();
        } catch (e) {
            this.showError(e);
        }
    }

    async sendTestPush() {
        try {
            const result = await fetch('/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: this.getClientToken(),
                }),
            });
            this.showSuccess(await result.json());
        } catch (e) {
            this.showError(e);
        }
    }
}
if (window.firebase) {
    new Push(firebase).init();
}
