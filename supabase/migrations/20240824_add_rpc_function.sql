-- Create a function to get user role without using RLS
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Disable row level security for this query
  SET LOCAL row_security = off;
  
  -- Get the role directly from the profiles table
  SELECT role INTO user_role
  FROM public.profiles
  WHERE id = user_id;
  
  -- Re-enable row level security
  RESET row_security;
  
  RETURN user_role;
EXCEPTION
  WHEN OTHERS THEN
    -- Always re-enable row level security
    RESET row_security;
    RAISE;
END;
$$; 