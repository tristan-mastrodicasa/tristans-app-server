import { Router } from 'express';

import { User } from 'database/entities/user.entity';
import { UserItem } from 'shared/models';

const router = Router();

router.get('/', (req, res, next) => {

  console.log(req.params);

  User.findOne(3).then(
    (user: User) => {

      if (user) {

        const userItem: UserItem = {
          id: user.id,
          firstName: user.firstName,
          username: user.username,
          photo: user.profileImg,
          influence: 100, /** @todo inner join stats */
          activeCanvases: 1, /** @todo inner join stats */
        };

        res.send([userItem]);
      }
    },
  );

});

export default router;
