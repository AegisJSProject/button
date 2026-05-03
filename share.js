import { CustomButton } from './button.js';

const sheet = new CSSStyleSheet();

sheet.replace(`@layer components {
	:host([hidden]) { display: none; }
}`);

export class ShareButton extends CustomButton {
	constructor() {
		super();

		if (typeof navigator.share === 'function') {
			this.hidden = false;
		} else {
			this.hidden = true;
			this.disabled = true;
		}
	}

	connectedCallback() {
		super.connectedCallback();

		if (typeof navigator.share === 'function') {
			// Parent class creates controller and aborts on disconnect
			this.addEventListener('click', ShareButton.#share, { signal: this.signal });
		}
	}

	get shareText() {
		return this.dataset.shareText;
	}

	set shareText(val) {
		if (typeof val === 'string') {
			this.dataset.shareText = val;
		} else {
			delete this.dataset.shareText;
		}
	}

	get shareTitle() {
		return this.dataset.shareTitle ?? document.title;
	}

	set shareTitle(val) {
		if (typeof val === 'string') {
			this.dataset.shareTitle = val;
		} else {
			delete this.dataset.shareTitle;
		}
	}

	get shareURL() {
		return this.dataset.shareUrl ?? location.href;
	}

	set shareURL(val) {
		if (typeof val === 'string') {
			this.dataset.shareUrl = val;
		} else {
			delete this.dataset.shareUrl;
		}
	}

	static async #share(event) {
		const btn = event.currentTarget;

		if (! btn.disabled) {
			btn.disabled = true;

			try {
				const {
					shareTitle: title = document.title,
					shareUrl = location.href,
					shareText: text,
					utmSource,
					utmMedium = 'referrer',
					utmCampaign,
					utmContent = 'share-button',
					utmTerm,
				} = btn.dataset;

				const url = new URL(shareUrl, document.baseURI);

				if (typeof utmSource === 'string') {
					url.searchParams.set('utm_source', utmSource);
					url.searchParams.set('utm_medium', utmMedium);
					url.searchParams.set('utm_content', utmContent);

					if (typeof utmCampaign === 'string') {
						url.searchParams.set('utm_campaign', utmCampaign);
					}

					if (typeof utmTerm === 'string') {
						url.searchParams.set('utm_term', utmTerm);
					}
				}

				await navigator.share({ title, url, text });
			} catch(error) {
				btn.dispatchEvent(new ErrorEvent('error', { error, message: error.message }));
			} finally {
				btn.disabled = false;
			}
		}
	}

	static {
		this.register('share-button');
	}
}
