import { CustomButton } from './button.js';

export class ShareButton extends CustomButton {
	constructor() {
		super();

		if (typeof navigator.share === 'function') {
			this.hidden = false;

			this.addEventListener('click', async event => {
				const btn = event.currentTarget;

				if (! btn.disabled) {
					btn.disabled = true;

					try {
						const {
							shareTitle: title = document.title,
							shareUrl: url = location.href,
							shareText: text,
						} = btn.dataset;

						await navigator.share({ title, url, text });
					} catch(error) {
						btn.dispatchEvent(new ErrorEvent('error', { error, message: error.message }));
					} finally {
						btn.disabled = false;
					}
				}
			});
		} else {
			this.hidden = true;
			this.disabled = true;
		}
	}

	static {
		this.register('share-button');
	}
}
