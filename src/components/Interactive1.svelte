<script lang="ts">
  type Key = 'userId' | 'name' | 'location'

  let selected = 'name' as Key
  let select = (key: Key) => () => (selected = key)

  let selectUserId = select('userId')
  let selectName = select('name')
  let selectLocation = select('location')

  $: isUserIdSelected = selected == 'userId'
  $: isNameSelected = selected == 'name'
  $: isLocationSelected = selected == 'location'
</script>

<div class="flex">
  <div class="w-24 grid place-content-center">
    <span class="text-sm">UI</span>
  </div>

  <div class="flex-grow grid grid-flow-col place-content-evenly">
    <table class="divide-y">
      <thead class="text-left">
        <tr>
          <th
            class="px-4 py-2"
            class:text-green-600={isUserIdSelected}
            on:mouseenter={selectUserId}
          >
            ID
          </th>
          <th
            class="px-4 py-2"
            class:text-green-600={isNameSelected}
            on:mouseenter={selectName}
          >
            姓名
          </th>
          <th
            class="px-4 py-2"
            class:text-green-600={isLocationSelected}
            on:mouseenter={selectLocation}
          >
            地区
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td
            class="px-4 py-2"
            class:text-green-600={isUserIdSelected}
            on:mouseenter={selectUserId}
          >
            1
          </td>
          <td
            class="px-4 py-2"
            class:text-green-600={isNameSelected}
            on:mouseenter={selectName}
          >
            小明
          </td>
          <td
            class="px-4 py-2"
            class:text-green-600={isLocationSelected}
            on:mouseenter={selectLocation}
          >
            北京
          </td>
        </tr>
        <tr>
          <td
            class="px-4 py-2"
            class:text-green-600={isUserIdSelected}
            on:mouseenter={selectUserId}
          >
            2
          </td>
          <td
            class="px-4 py-2"
            class:text-green-600={isNameSelected}
            on:mouseenter={selectName}
          >
            Jane Doe
          </td>
          <td
            class="px-4 py-2"
            class:text-green-600={isLocationSelected}
            on:mouseenter={selectLocation}
          >
            Ape City
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

<div class="flex">
  <div class="w-24 grid place-content-center">
    <span class="text-sm">接口</span>
  </div>

  <div class="flex-grow grid grid-flow-col place-content-evenly">
    <div class="font-mono text-sm">
      <p>[</p>
      <p class="pl-4">
        {'{'}
        <span
          class:text-green-600={isUserIdSelected}
          on:mouseenter={selectUserId}
        >
          "userId": 1,
        </span>
        <span class:text-green-600={isNameSelected} on:mouseenter={selectName}>
          "name": "小明",
        </span>
        <span
          class:text-green-600={isLocationSelected}
          on:mouseenter={selectLocation}
        >
          "location": "北京"
        </span>
        {'},'}
      </p>
      <p class="pl-4">
        {'{'}
        <span
          class:text-green-600={isUserIdSelected}
          on:mouseenter={selectUserId}
        >
          "userId": 2,
        </span>
        <span class:text-green-600={isNameSelected} on:mouseenter={selectName}>
          "name": "Jane Doe",
        </span>
        <span
          class:text-green-600={isLocationSelected}
          on:mouseenter={selectLocation}
        >
          "location": "Ape City"
        </span>
        {'}'}
      </p>
      <p>]</p>
    </div>
  </div>
</div>

<div class="flex">
  <div class="w-24 grid place-content-center">
    <span class="text-sm">数据源</span>
  </div>

  <div class="flex-grow grid grid-flow-col place-content-evenly">
    <div class="grid place-content-center">
      <div class="font-mono text-sm">
        <p>[</p>
        <p class="pl-4">
          {'{'}
          <span
            class:text-green-600={isUserIdSelected}
            on:mouseenter={selectUserId}
          >
            "userId": 1
          </span>
          {'},'}
        </p>
        <p class="pl-4">
          {'{'}
          <span
            class:text-green-600={isUserIdSelected}
            on:mouseenter={selectUserId}
          >
            "userId": 2
          </span>
          {'}'}
        </p>
        <p>]</p>
      </div>
    </div>

    <div class="grid place-content-center">
      <div class="font-mono text-sm">
        <p>{`{`}</p>
        <p class="pl-4">
          <span>1: {`{`}</span>
          <span
            class:text-green-600={isNameSelected}
            on:mouseenter={selectName}
          >
            "name": "小明",
          </span>
          <span
            class:text-green-600={isLocationSelected}
            on:mouseenter={selectLocation}
          >
            "location": "北京"
          </span>
          <span>{`}`},</span>
        </p>
        <p class="pl-4">
          <span>2: {`{`}</span>
          <span
            class:text-green-600={isNameSelected}
            on:mouseenter={selectName}
          >
            "name": "Jane Doe",
          </span>
          <span
            class:text-green-600={isLocationSelected}
            on:mouseenter={selectLocation}
          >
            "location": "Ape City"
          </span>
          <span>{`}`}</span>
        </p>
        <p class="pl-4">3: ...</p>
        <p>{`}`}</p>
      </div>
    </div>
  </div>
</div>
