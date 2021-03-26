<script>
  import { rem } from '../constants'
  import Tree from './Tree.svelte'

  let width = 32 * rem
  let height = 15 * rem

  let data = {
    id: 'student',
    children: [
      { id: 'userId' },
      {
        id: 'profile',
        children: [{ id: 'name' }, { id: 'location' }],
      },
      {
        id: 'device',
        children: [{ id: 'os' }],
      },
    ],
  }
</script>

<div class="flex-grow grid place-content-center">
  <Tree {width} {height} {data} />
</div>
