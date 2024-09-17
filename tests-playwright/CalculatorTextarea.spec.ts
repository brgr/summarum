import { test, expect } from '@playwright/test';

test('go to my page', async ({ page }) => {
    await page.goto('/');

    let textarea = page.getByLabel('calculator-textarea');

    let innerHTML = await textarea.innerHTML()

    // Expect a title "to contain" a substring.
    console.log(textarea);
    console.log(innerHTML);
    // TODO: This works now. Now actually write the test(s)
});



// test('CalculatorTextarea renders the textarea', () => {
//     const {container} = render(CalculatorTextarea);
//
//     const textarea = container.querySelector('.calculator-textarea');
//
//     expect(textarea).not.toBeNull();
//     expect(textarea).toBeInTheDocument();
//     // @ts-ignore
//     expect(textarea.textContent).toBe('');
// });

test('CalculatorTextarea: enter a letter in an editor-line', async ({ page }) => {
    // write the above test now in playwright
    await page.goto('/');

    let textarea = page.getByLabel('calculator-textarea');

    // Wait until textarea has a child div with class editor-line
    await expect(textarea.locator('div.editor-line')).toBeVisible();


    let innerHTML = await textarea.innerHTML();
    console.log('innerHTML', innerHTML);

    await textarea.fill('a');

    // remove focus

    innerHTML = await textarea.innerHTML();
    console.log('innerHTML', innerHTML);
    let divInInnerHTML = textarea.locator('div').first();
    // check the class
    await expect(divInInnerHTML).toHaveClass(/editor-line/); // FIXME: It seems like this really isn't working for Firefox... I need to debug deeper inside
    await expect(divInInnerHTML).toHaveAttribute('contenteditable', 'true');
    expect(await divInInnerHTML.innerHTML()).toEqual('a');
    expect(innerHTML).toContain('a');
});