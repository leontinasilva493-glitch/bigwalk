import test from 'node:test';
import assert from 'node:assert/strict';

test('native ad runtime mounts the supplied Adsterra script immediately before its container', async () => {
  const runtime = await import('../lib/adsterra-native.mjs').catch(() => null);

  assert.ok(runtime, 'the native ad runtime exists');

  const container = {
    id: runtime.NATIVE_AD_CONTAINER_ID,
    children: ['stale ad markup'],
    replaceChildren() {
      this.children = [];
    },
  };
  const parent = {
    children: [container],
    insertBefore(node, reference) {
      const index = this.children.indexOf(reference);
      this.children.splice(index, 0, node);
      node.parentNode = this;
    },
    removeChild(node) {
      this.children = this.children.filter((child) => child !== node);
      node.parentNode = null;
    },
  };
  container.parentNode = parent;

  const document = {
    createElement(tagName) {
      return {
        tagName: tagName.toUpperCase(),
        async: false,
        attributes: new Map(),
        setAttribute(name, value) {
          this.attributes.set(name, value);
        },
        remove() {
          this.parentNode?.removeChild(this);
        },
      };
    },
  };

  const unmount = runtime.mountAdsterraNativeAd(document, container);
  const [script, mountedContainer] = parent.children;

  assert.equal(script.tagName, 'SCRIPT');
  assert.equal(script.src, runtime.NATIVE_AD_SCRIPT_SRC);
  assert.equal(script.async, true);
  assert.equal(script.attributes.get('data-cfasync'), 'false');
  assert.equal(mountedContainer, container, 'the script is placed before the target container');
  assert.deepEqual(container.children, [], 'mount removes stale ad markup before requesting a new ad');

  container.children.push('injected ad markup');
  unmount();
  assert.deepEqual(parent.children, [container], 'unmount removes the route-specific script');
  assert.deepEqual(container.children, [], 'unmount removes markup injected for the previous route');
});
