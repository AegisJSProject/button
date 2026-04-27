import { CustomButton } from './button.js';

export class ForwardButton extends CustomButton {
	constructor() {
		super();

		this.addEventListener('click', ({ currentTarget }) => {
			if (! currentTarget.disabled) {
				history.forward();
			}
		});
	}

	static {
		this.register('forward-button');
	}
}
