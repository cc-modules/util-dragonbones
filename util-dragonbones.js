function playAnimation(node, anim, playTimes = 1, nextAnim) {
  const armatureDispaly = node.getComponent(dragonBones.ArmatureDisplay);
  return new Promise((rs) => {
    armatureDispaly.playAnimation(anim, playTimes);
    armatureDispaly.once('complete', (event) => {
      if (nextAnim) {
        rs(armatureDispaly.playAnimation(nextAnim));
      } else {
        rs(event);
      }
    }, this);
  });
}

function verbalize(node, anims) {
  const nodes = Array.isArray(node) ? node : [node];
  if (Array.isArray(anims)) {
    anims.forEach(anim => {
      nodes.forEach(node => {
        node[anim] = function (...args) {
          return playAnimation(node, anim, ...args);
        };
      });
    });
  } else {
    for (let alias in anims) {
      nodes.forEach(node => {
        const method = alias;
        const anim = anims[method];
        node[method] = function (...args) {
          return playAnimation(node, anim, ...args);
        };
      });
    }
  }
  return node;
}

export default {
  playAnimation: playAnimation,
  $verbolize: verbalize,
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
