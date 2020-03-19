function playAnimation(node, anim, playTimes = 1, nextAnim) {
  const armatureDispaly = node.getComponent(dragonBones.ArmatureDisplay);
  return new Promise((rs) => {
    armatureDispaly.playAnimation(anim, playTimes);
    armatureDispaly.once('complete', (event) => {
      rs(event);
      if (nextAnim) armatureDispaly.playAnimation(nextAnim);
    }, this);
  });
}

export default {
  playAnimation: playAnimation,
  $inject(nodes, prefix = '') {
    if (!Array.isArray(nodes) && cc.Node.isNode(nodes)) {
      nodes = [nodes];
    }
    nodes.forEach((node) => {
      Object.keys(this).forEach(key => {
        if (key.match(/^\$|[0-9_]$/)) return;
        const newKey = `${prefix}${key}`;
        if (typeof node[newKey] !== 'undefined') {
          console.warn(`${newKey} already defined on node. Consider using $inject(..., prefix)`);
        } else {
          node[newKey] = this[key].bind(node, node);
        }
      });
    });
  }
};