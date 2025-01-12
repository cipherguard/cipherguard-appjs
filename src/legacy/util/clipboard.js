import Plugin from './plugin';

class Clipboard {
  static copy(value, name) {
    name = name || null;
    const eventData = {
      name: name,
      data: value
    };
    Plugin.send('cipherguard.clipboard', eventData);
  }
}

export default Clipboard;
