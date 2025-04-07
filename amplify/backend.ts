import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { hogeschedule } from './hogejob/hogeschedule/resource';

import { CfnRule } from 'aws-cdk-lib/aws-events';
import { Aspects, IAspect } from 'aws-cdk-lib';
import { IConstruct } from 'constructs';

const backend = defineBackend({
  auth,
  data,
  hogeschedule,
});

class DisableScheduleRules implements IAspect {
  visit(node: IConstruct): void {
    if (node instanceof CfnRule) {
      if (node.node.path.includes('hogeschedule')) {
        node.state = 'DISABLED';
      }
    }
  }
}
Aspects.of(backend.stack).add(new DisableScheduleRules());