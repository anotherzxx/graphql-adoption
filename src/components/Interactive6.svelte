<script>
  import { rem } from '../constants'
  import Tree from './Tree.svelte'

  let width = 20 * rem
  let height = 10 * rem

  let data = {
    id: 'student',
    children: [{ id: 'userId' }, { id: 'profile' }],
  }
</script>

<div class="flex-grow grid place-content-center">
  <Tree {width} {height} {data} />
</div>
