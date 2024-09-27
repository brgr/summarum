import {test, expect} from '@playwright/test';

test('CalculatorTextarea: enter a letter in an editor-line', async ({page}) => {
    // Add --debug to Playwright to be able to debug the browser
    await page.goto('http://localhost:5173/');
    let textbox = page.getByRole('textbox');
    await textbox.locator('div').click();
    await textbox.fill('1000');

    let innerHTML = await textbox.innerHTML();
    console.log(innerHTML);

    let textContent = await textbox.textContent();
    console.log(textContent);

    // First is the input, second is the (non-editable) math output
    expect(textContent).toEqual('1000 1000');

    // just wait forever
    // await new Promise(() => {});
});
