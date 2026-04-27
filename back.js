import { CustomButton } from './button.js';

export class BackButton extends CustomButton {
	constructor() {
		super();

		this.addEventListener('click', ({ currentTarget }) => {
			if (! currentTarget.disabled) {
				history.back();
			}
		});
	}

	static {
		this.register('back-button');
	}
}
