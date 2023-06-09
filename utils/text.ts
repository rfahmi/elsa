export const clean = (text) => {
  const specialChars = /([\\`*_{}\[\]\(\)#\+\-\.!$%^&?<>=|:";'])/g;
  const escapeMap = {
    '\\': '\\\\',
    '`': '\\`',
    '*': '\\*',
    _: '\\_',
    '{': '\\{',
    '}': '\\}',
    '[': '\\[',
    ']': '\\]',
    '(': '\\(',
    ')': '\\)',
    '#': '\\#',
    '+': '\\+',
    '-': '\\-',
    '.': '\\.',
    '?': '\\?',
    '!': '\\!',
    '<': '\\<',
    '>': '\\>',
    $: '\\$',
    '%': '\\%',
    '^': '\\^',
    '&': '\\&',
    '=': '\\=',
    '|': '\\|',
    ':': '\\:',
    '"': '\\"',
    ';': '\\;',
    "'": "\\'",
  };

  return text.replace(specialChars, (match) => {
    return escapeMap[match];
  });
};
