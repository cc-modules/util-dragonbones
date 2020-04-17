function playAnimation(node, anim, playTimes = 1, ...args) {
  const armatureDispaly = node.getComponent(dragonBones.ArmatureDisplay);
  return new Promise((rs) => {
    armatureDispaly.playAnimation(anim, playTimes);
    armatureDispaly.once('complete', (event) => {
      if (args && args.length) {
        // rs(armatureDispaly.playAnimation(nextAnim));
        rs(playAnimation(node,...args));
      } else {
        rs(event);
      }
    }, this);
  });
}

function doVerbalize(node, method, anim) {
  if (Array.isArray(anim)){
    const [ani, ..._args] = anim;
    node[method] = function (...args) {
      return playAnimation(node, ani, ..._args.concat(args));
    };
  } else {
    node[method] = function (...args) {
      return playAnimation(node, anim, ...args);
    };
  }
}

function verbalize(node, anims) {
  const nodes = Array.isArray(node) ? node : [node];
  if (Array.isArray(anims)) {
    anims.forEach(anim => {
      nodes.forEach(node => {
        doVerbalize(node, anim, anim);
        // node[anim] = function (...args) {
        //   return playAnimation(node, anim, ...args);
        // };
      });
    });
  } else {
    for (let alias in anims) {
      nodes.forEach(node => {
        const method = alias;
        const anim = anims[method];
        doVerbalize(node, method, anim);
        // node[method] = function (...args) {
        //   return playAnimation(node, anim, ...args);
        // };
      });
    }
  }
  return node;
}

export default {
  playAnimation: playAnimation,
  $verbalize: verbalize,
  $inject(nodes, prefix = '') {
    if (!Array.isArray(nodes) && cc.Node.isNode(nodes)) {
      nodes = [nodes];
    }
    nodes.forEach((node) => {
      if (node && node.__$injected$dragonbones) return;
      Object.keys(this).forEach(key => {
        if (key.match(/^\$|[0-9_]$/)) return;
        const newKey = `${prefix}${key}`;
        if (typeof node[newKey] !== 'undefined') {
          console.warn(`${newKey} already defined on node. Consider using $inject(..., prefix)`);
        } else {
          node[newKey] = this[key].bind(node, node);
        }
      });
      node.__$injected$dragonbones = true;
    });
  }
};
