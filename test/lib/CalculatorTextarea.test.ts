import {render, screen} from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import {expect, test} from 'vitest';

// import Greeter from './greeter.svelte'
import CalculatorTextarea from '../../src/lib/CalculatorTextarea.svelte';

test('CalculatorTextarea renders the textarea', () => {
    const {container} = render(CalculatorTextarea);

    const textarea = container.querySelector('.calculator-textarea');

    expect(textarea).not.toBeNull();
    expect(textarea).toBeInTheDocument();
    // @ts-ignore
    expect(textarea.textContent).toBe('');
});

test('CalculatorTextarea: enter a letter', async () => {
    const {container} = render(CalculatorTextarea);

    const textarea = container.querySelector('.calculator-textarea')!;
    await userEvent.type(textarea, 'a');

    expect(textarea).toHaveTextContent('a');
    // FIXME: It works, but: It looks like this:
    // a<div class="editor-line" contenteditable="true"><br></div>
    // I.e., the letter not inside .editor-line
    // Also, at this point ,the there should be no line break yet!
});

// TODO: Add a test for syntax highlighting of numbers
