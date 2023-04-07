import { useState } from 'react'
import { Stack, IStackTokens, IStackStyles } from '@fluentui/react/lib/Stack'
import { SearchBox, ISearchBoxStyles } from '@fluentui/react/lib/SearchBox'
import { IIconProps } from '@fluentui/react/lib/Icon'
import { Checkbox, PrimaryButton, DefaultButton } from '@fluentui/react'
import { Image, IImageProps } from '@fluentui/react/lib/Image'

const SearchForm = () => {
  // styles
  const formWrapperStyle: React.CSSProperties = {
    maxWidth: 600,
    marginInline: "auto",
    paddingTop: 20,
  }
  const stackStyles: IStackStyles = {
    root: {
      display: 'flex',
      justifyContent: 'center',
    },
  }
  
  const filterIcon: IIconProps = { iconName: 'Search' }
  const stackTokens: Partial<IStackTokens> = { childrenGap: 20 }
  const stackButtonsTokens: Partial<IStackTokens> = { childrenGap: 20 }
  const searchBoxStyles: Partial<ISearchBoxStyles> = { root: { height: 50 } }
  const imageProps: Partial<IImageProps> = {
    width: 40,
    height: 40,
  }


  interface ICategories {
    field: string;
    checked: boolean;
    img: string
  }

  const initCategoriesState = [
    {
      "field": "PC Games",
      "checked": false,
      "img": '/assets/img/pc-gaming.png'
    },
    {
      "field": "Mobile Games",
      "checked": false,
      "img": '/assets/img/mobile-gaming.png'
    },
    {
      "field": "Console Games",
      "checked": false,
      "img": '/assets/img/console-gaming.png'
    }
  ]

  // states
  const [user, setUser] = useState<[] | null>()
  const [username, setUsername] = useState<string | undefined>('')
  const [categories, setCategories] = useState<Array<ICategories>>(initCategoriesState)
  const [success, setSuccess] = useState<boolean>(false)
  const [showForm, setShowForm] = useState<boolean>(false)

  // reset states
  const resetState = () => {
    setUser(null)
    setUsername('')
    setCategories(initCategoriesState)
    setSuccess(false)
    setShowForm(false)
  };

  // handle username
  const handleUserNameChange = (event?: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event?.target.value);
  };
  // check selected checkboxes & update categories
  const updateCategories = (index: number, isChecked: boolean) => {
    const updatedCategories = [...categories];
    updatedCategories[index].checked = !isChecked;
    setCategories(updatedCategories);
  }
  // set custom label with img
  const setLabel = (itemField: string, itemImg: string) => {
    return (
      <div className="label-wrapper">
        <Image {...imageProps} src={itemImg} alt="gaming" />
        <span className="ms-fontSize-lg">{itemField}</span>
      </div>
    )
  }

  // search user name
  const searchUsername = async () => {
    await fetch(`http://localhost:8000/users?username=${username}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then(res => res.json())
      .then(result => 
        {
          if (result.length == 1) {
            setUser(result)
            let categories = result.map((item: any) => {return item.newsletter})
            setCategories(categories[0])
            setSuccess(true)
          } else {
            setCategories(initCategoriesState)
            setSuccess(false)
          }
          setShowForm(true)
      }
      )
      .catch(error => console.log(error));
  }

  // update user data
  const updateData = async () => {
    const userID = user?.map((item:any) => {return item.id})
    await fetch(`http://localhost:8000/users/${userID}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({username: username, newsletter: categories})
      }
    )
    .then(response =>
      {
        if (response.ok) {
          alert("Settings updated successfully")
          resetState()
        }
      }
    )
    .catch(error => console.log(error));
  }
  // create new user
  const createData = async () => {
    await fetch(`http://localhost:8000/users/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({username: username, newsletter: categories})
      }
    )
    .then(response =>
      {
        if (response.ok) {
          alert("User created successfully")
          resetState()
        }
      }
    )
    .catch(error => console.log(error));
  }
  // save button handler
  const saveButtonHandler = () => {
    if (username != '') {
      if (success) {
        updateData()
      } else {
        createData()
      }
    } else {
      alert('Enter username')
    }
  }

  return (
    <div className="form-wrapper" style={formWrapperStyle}>
      <Stack tokens={stackTokens}>
        <Stack>
          <SearchBox 
            placeholder="Search for a username (Press ENTER to search)" 
            onSearch={searchUsername} 
            onChange={handleUserNameChange}
            onEscape={() => setUsername('')}
            iconProps={filterIcon}
            styles={searchBoxStyles}
            value={username}
          />
        </Stack>
        {showForm && 
          <>
            {success ? <div className="ms-fontSize-24">User already exists - update settings</div>  
              : <div className="ms-fontSize-24 ms-TextAlignCenter">Create new user</div>
            }
            <div className="ms-fontSize-18">Select the newsletters you wish to receive:</div>
            <Stack 
              className="ms-Stack-categories"
              horizontal
              styles={stackStyles}
              tokens={stackTokens}>
              {
                categories.map((item, index) =>
                  <div key = {item.field}>
                    <Checkbox 
                    onRenderLabel={()=>setLabel(item.field, item.img)} 
                    checked={item.checked} 
                    onChange={() => updateCategories(index, item.checked)} 
                  />
                  </div>
                )
              }
            </Stack>
            <Stack
              tokens={stackButtonsTokens} 
              horizontal
              reversed
            >
              <Stack.Item align="end">
                <DefaultButton onClick={resetState}>Close</DefaultButton>
              </Stack.Item>
              <Stack.Item align="end">
                <PrimaryButton onClick={saveButtonHandler}>Save</PrimaryButton>
              </Stack.Item>
            </Stack>
          </>
        }
      </Stack>
    </div>
  );
}

export default SearchForm